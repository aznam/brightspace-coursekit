<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
    
    <xsl:output method="xml" omit-xml-declaration="yes"/>
    
    <xsl:template match="/">
        <xsl:choose>
            <xsl:when test="/*/@type = 'ordered'">
                <ol class="ck-list">
                    <ck-children/>
                </ol>
            </xsl:when>
            <xsl:otherwise>
                <ul class="ck-list">
                    <ck-children/>
                </ul>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
</xsl:stylesheet>