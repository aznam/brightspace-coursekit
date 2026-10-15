<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
    
    <xsl:output method="xml" omit-xml-declaration="yes"/>
    
    <xsl:template match="/">
        <aside class="ck-infobox">
            
            <xsl:if test="string(/*/@title)">
                <div class="ck-infobox__header">
                    <xsl:if test="/*/@icon and not(/*/@icon='none')">
                        <span class="ck-infobox__icon" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path>
                                    <xsl:attribute name="d">
                                        <xsl:choose>
                                            <xsl:when test="/*/@icon='warning' or (not(/*/@icon) and /*/@variant='warning')">M12 9v4 M12 17h.01 M10.3 3.8 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0</xsl:when>
                                            <xsl:when test="/*/@icon='success' or (not(/*/@icon) and /*/@variant='success')">M5 12l4 4L19 6</xsl:when>
                                            <xsl:when test="/*/@icon='error' or (not(/*/@icon) and /*/@variant='error')">M6 6l12 12 M18 6L6 18</xsl:when>
                                            <xsl:when test="/*/@icon='dark' or (not(/*/@icon) and /*/@variant='dark')">M12 3v18 M3 12h18</xsl:when>
                                            <xsl:when test="/*/@icon='neutral' or (not(/*/@icon) and /*/@variant='neutral')">M4 6h16 M4 12h16 M4 18h10</xsl:when>
                                            <xsl:otherwise>M12 9h.01 M11 12h1v4h1 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0</xsl:otherwise>
                                        </xsl:choose>
                                    </xsl:attribute>
                                </path>
                            </svg>
                        </span>
                    </xsl:if>
                    <h3 class="ck-infobox__title"><xsl:value-of select="/*/@title"/></h3>
                </div>
            </xsl:if>
            
            <div class="ck-infobox__body">
                <ck-children/>
            </div>
            
        </aside>
    </xsl:template>
    
</xsl:stylesheet>

