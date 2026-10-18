<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
    <xsl:output method="xml" omit-xml-declaration="yes"/>
    <xsl:template match="/">
        <div class="ck-tutorial">
            <xsl:if test="/*/@title">
                <h3 class="ck-tutorial__title"><xsl:value-of select="/*/@title"/></h3>
            </xsl:if>
            <div class="ck-tutorial__content">
                <div class="ck-tutorial__media"><ck-slot name="illustration"/></div>
                <div class="ck-tutorial__instructions"><ck-children/></div>
            </div>
        </div>
    </xsl:template>
</xsl:stylesheet>
